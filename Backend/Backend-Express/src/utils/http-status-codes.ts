export enum HttpStatusCode {
    // 2xx Success
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,

    // 3xx Redirection
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    NOT_MODIFIED = 304,

    // 4xx Client Error
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    TOO_MANY_REQUESTS = 429,

    // 5xx Server Error
    INTERNAL_SERVER_ERROR = 500,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
}