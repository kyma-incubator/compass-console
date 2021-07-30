import jsyaml from 'js-yaml';
import xmlJS from 'xml-js';

function isYAML(file) {
  return file.name.endsWith('.yaml') || file.name.endsWith('.yml');
}

function isJSON(file) {
  return file.name.endsWith('.json');
}

function isXML(file) {
  return file.name.endsWith('.xml');
}

function isAsyncApi(spec) {
  // according to https://www.asyncapi.com/docs/specifications/1.2.0/#a-name-a2sobject-a-asyncapi-object
  return spec && !!spec.asyncapi;
}

function isSwaggerApi(spec) {
  // according to https://swagger.io/specification/#versions
  return spec && !!spec.swagger;
}

function isOpenApi(spec) {
  // according to https://swagger.io/specification/#fixed-fields
  return spec && !!spec.openapi;
}

function isOData(spec) {
  // OData should be in EDMX format
  return spec && !!spec['edmx:Edmx'];
}

function parseXML(textData) {
  const parsed = xmlJS.xml2js(textData, { compact: true });
  // xmlJS returns empty object if parsing failed
  if (!Object.keys(parsed).length) {
    throw Error('Parse error');
  }
  return parsed;
}

export function createApiData(basicApiData, specData) {
  return {
    ...basicApiData,
    spec: specData,
  };
}

export function createEventAPIData(basicApiData, specData) {
  const spec = specData
    ? {
        ...specData,
        type: 'ASYNC_API',
      }
    : null;

  return {
    ...basicApiData,
    spec,
  };
}

function parseForFormat(apiText, format) {
  const parsers = {
    JSON: JSON.parse,
    YAML: jsyaml.safeLoad,
    XML: parseXML,
  };

  try {
    return parsers[format](apiText);
  } catch (_) {
    return { error: 'Parse error' };
  }
}

export function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsText(file);
  });
}

export function checkApiFormat(file) {
  switch (true) {
    case isYAML(file):
      return 'YAML';
    case isJSON(file):
      return 'JSON';
    case isXML(file):
      return 'XML';
    default:
      return false;
  }
}

export function checkEventApiFormat(file) {
  switch (true) {
    case isYAML(file):
      return 'YAML';
    case isJSON(file):
      return 'JSON';
    default:
      return false;
  }
}

export async function verifyEventApiFile(file) {
  const format = checkEventApiFormat(file);
  if (format === null) {
    return { error: 'Error: Invalid file type' };
  }

  const data = await readFile(file);
  const spec = parseForFormat(data, format);

  if (!isAsyncApi(spec)) {
    return {
      error: 'Supplied spec does not have required "asyncapi" property',
    };
  }

  return { error: null, format, data };
}

export async function verifyApiFile(file, expectedType) {
  const format = checkApiFormat(file);
  if (format === null) {
    return { error: 'Error: Invalid file type' };
  }

  const data = await readFile(file);
  const spec = parseForFormat(data, format);

  if (!spec) {
    return { error: 'Parse error' };
  }

  if (!isSwaggerApi(spec) && !isOpenApi(spec) && expectedType === 'OPEN_API') {
    return {
      error:
        'Supplied spec does not have required "swagger" or "openapi" property',
    };
  }

  if (!isSwaggerApi(spec) && expectedType === 'openapi-v2') {
    return {
      error: 'Supplied spec does not have required "swagger" property',
    };
  }
  if (!isOpenApi(spec) && expectedType === 'openapi-v3') {
    return {
      error: 'Supplied spec does not have required "openapi" property',
    };
  }
  if (!isOData(spec) && expectedType === 'ODATA') {
    return {
      error: 'Supplied spec does not have required "edmx:Edmx" property',
    };
  }

  return { error: null, format, data };
}

export function verifyApiInput(apiText, format, apiType) {
  const spec = parseForFormat(apiText, format);
  if (!spec) {
    return { error: 'Parse error' };
  }

  if (!isSwaggerApi(spec) && !isOpenApi(spec) && apiType === 'OPEN_API') {
    return { error: '"swagger" or "openapi" property is required' };
  }

  if (!isSwaggerApi(spec) && apiType === 'openapi-v2') {
    return { error: '"swagger" property is required' };
  }
  if (!isOpenApi(spec) && apiType === 'openapi-v3') {
    return { error: '"openapi" property is required' };
  }
  if (!isOData(spec) && (apiType === 'ODATA' || apiType === 'edmx')) {
    return { error: '"edmx:Edmx" property is required' };
  }

  return { error: null };
}

export function verifyEventApiInput(eventApiText, format) {
  const spec = parseForFormat(eventApiText, format);
  if (!spec) {
    return { error: 'Parse error' };
  }

  if (!isAsyncApi(spec)) {
    return { error: '"asyncapi" property is required' };
  }

  return { error: null };
}

export function getApiType(api) {
  switch (api.spec && api.spec.type) {
    case 'OPEN_API':
    case 'openapi-v2':
    case 'openapi-v3':
      return 'openapi';
    case 'ODATA':
    case 'edmx':
      return 'odata';
    case 'ASYNC_API':
      return 'asyncapi';
    default:
      return null;
  }
}

export function getApiDisplayName(api) {
  if (api.spec && api.spec.type) {
      return api.spec.type.toUpperCase();
  }
}
