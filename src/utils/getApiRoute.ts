export default function getApiRoute(apiUrl: string, params: Record<string, string>): string {
  let path = apiUrl;

  Object.keys(params).forEach((paramName) => {
    if (Object.prototype.hasOwnProperty.call(params, paramName)) {
      const paramValue = params[paramName];
      const paramPlaceholder = `:${paramName}`;

      path = path.replace(paramPlaceholder, paramValue);
    }
  });

  return path;
}
