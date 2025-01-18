import swaggerJSDoc from 'swagger-jsdoc';
import swaggerOptions from '@config/swagger.config';

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;