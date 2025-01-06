import helmet from 'helmet';

type HelmetConfigOptions = {
    contentSecurityPolicy: boolean | object;
};

const configureHelmet = (): ReturnType<typeof helmet> => {
    const options: HelmetConfigOptions = {
        contentSecurityPolicy: process.env.NODE_ENV === 'production' ? true : false,
    };

    return helmet({
        contentSecurityPolicy: options.contentSecurityPolicy,
        crossOriginEmbedderPolicy: true,
        crossOriginResourcePolicy: { policy: 'same-origin' },
        hsts: { maxAge: 63072000, includeSubDomains: true },
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
        permittedCrossDomainPolicies: { permittedPolicies: 'none' },
        dnsPrefetchControl: { allow: false },
        ieNoOpen: true,
        noSniff: true,
        xssFilter: true,
        hidePoweredBy: true,
    });
};

export default configureHelmet;
