import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { createSwaggerSpec } from 'next-swagger-doc';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic<{
  spec: any;
}>(import('swagger-ui-react'), { ssr: false });

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log({ spec });

  return <SwaggerUI spec={spec} />;
}

export const getStaticProps: GetStaticProps = async () => {
  // console.log('tos', mongooseToSwagger(Organization).properties.initiatives);
  // const spec: Record<string, any> = createSwaggerSpec({
  //   definition: {
  //     openapi: '3.0.0',
  //     info: {
  //       title: 'CFCE Registry',
  //       version: '1.0',
  //     },
  //   },
  //   apiFolder: 'pages/api',
  // });
  // console.log({ spec: JSON.stringify(spec) });

  return {
    props: {
      // spec: {},
      spec: {
        openapi: '3.0.0',
        info: {
          title: 'CFCE Registry',
          version: '1.0',
        },
        paths: {
          // 'api/organizations': mongooseToSwagger(Organization),
        },
      },
    },
  };
};

export default ApiDoc;
