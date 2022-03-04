# Default configuration
IMG_NAME := $(DOCKER_PUSH_REPOSITORY)$(DOCKER_PUSH_DIRECTORY)/$(APP_NAME)
TAG := $(DOCKER_TAG)
# LOCAL_DIR in a local path to scripts folder
LOCAL_DIR = $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
# COMPONENT_DIR is a local path to commponent
COMPONENT_DIR = $(shell pwd)
# WORKSPACE_COMPONENT_DIR is a path to commponent in the container
WORKSPACE_COMPONENT_DIR = /workspace/$(APP_PATH)

ifndef ARTIFACTS
ARTIFACTS:=/tmp/artifacts
endif

# Base docker configuration
DOCKER_CREATE_OPTS := -v $(ARTIFACTS):/tmp/artifacts --rm -w $(WORKSPACE_COMPONENT_DIR) $(BUILDPACK)

.DEFAULT_GOAL := verify

# Check if running with TTY
ifeq (1, $(shell [ -t 0 ] && echo 1))
DOCKER_INTERACTIVE := -i
DOCKER_CREATE_OPTS := -t $(DOCKER_CREATE_OPTS)
else
DOCKER_INTERACTIVE_START := --attach 
endif

# Buildpack directives
define buildpack-mount
.PHONY: $(1)-local $(1)
$(1):
	@echo make $(1)
	@docker run $(DOCKER_INTERACTIVE) \
		-v $(COMPONENT_DIR)/..:/workspace:delegated \
		$(DOCKER_CREATE_OPTS) make $(1)-local
endef

define buildpack-cp-ro
.PHONY: $(1)-local $(1)
$(1):
	@echo make $(1)
	$$(eval container = $$(shell docker create $(DOCKER_CREATE_OPTS) make $(1)-local))
	@docker cp $(COMPONENT_DIR)/../. $$(container):/workspace/
	@docker start $(DOCKER_INTERACTIVE_START) $(DOCKER_INTERACTIVE) $$(container)
endef

.PHONY: verify format release

# You may add additional targets/commands to be run on format and verify. Declare the target again in your makefile,
# using two double colons. For example to run errcheck on verify add this to your makefile:
#
#   verify:: errcheck
#
verify:: test validate-shared 


release: build-image

.PHONY: validate
validate-shared:
	npm run --prefix=../ lint-check
	npm run --prefix=../ test-shared-lib


.PHONY: build-image
build-image: pull-licenses
	docker run --rm --privileged linuxkit/binfmt:v0.8 # https://stackoverflow.com/questions/70066249/docker-random-alpine-packages-fail-to-install
	docker buildx create --name multi-arch-builder --use
	docker buildx build --platform linux/amd64,linux/arm64 -t $(IMG_NAME):$(TAG) --push -f Dockerfile ..
docker-create-opts:
	@echo $(DOCKER_CREATE_OPTS)

# Targets mounting sources to buildpack
MOUNT_TARGETS = pull-licenses
$(foreach t,$(MOUNT_TARGETS),$(eval $(call buildpack-mount,$(t))))

build:
	npm run build

test:
	CI=true npm run test

resolve:
	cd .. && npm run bootstrap:ci
	npm ci --no-optional

pull-licenses-local:
ifdef LICENSE_PULLER_PATH
	bash $(LICENSE_PULLER_PATH) --dirs-to-pulling="../,../common,../components/react,../components/shared,../components/generic-documentation"
else
	mkdir -p licenses
endif


# Targets copying sources to buildpack
COPY_TARGETS = do-npm-stuff
$(foreach t,$(COPY_TARGETS),$(eval $(call buildpack-cp-ro,$(t))))

.PHONY: list
list:
	@$(MAKE) -pRrq -f $(COMPONENT_DIR)/Makefile : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$'

.PHONY: exec
exec:
	@docker run $(DOCKER_INTERACTIVE) \
    		-v $(COMPONENT_DIR):$(WORKSPACE_COMPONENT_DIR):delegated \
    		$(DOCKER_CREATE_OPTS) bash
