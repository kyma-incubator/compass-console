ci-pr: resolve validate validate-libraries
ci-main: resolve validate validate-libraries

.PHONY: resolve
resolve:
	npm run bootstrap:ci

.PHONY: validate
validate:
	npm run lint-check
	npm run test-shared-lib
	# npm run markdownlint

.PHONY: validate-libraries
validate-libraries:
	cd common && npm run type-check
	cd components/shared && npm run type-check
	cd components/generic-documentation && npm run type-check

.PHONY: update-deps
update-deps:
	rm -fr node_modules && rm package-lock.json && npm install && npm update && npm upgrade
	cd components/generic-documentation && rm package-lock.json && npm install && npm update && npm upgrade
	cd components/react && rm package-lock.json && npm install && npm update && npm upgrade
	cd components/shared && rm package-lock.json && npm install && npm update && npm upgrade
	cd compass && rm package-lock.json && npm install && npm update && npm upgrade
	cd shared && rm package-lock.json && npm install && npm update && npm upgrade
