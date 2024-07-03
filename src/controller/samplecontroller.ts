import { APIGatewayEvent, Context, Callback } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    try {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Welcome to your TypeScript Lambda function!",
            }),
        };
    } catch (error:any) {
        console.error("Error:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error occurred.",
                error: error.message,
            }),
        };
    }
};
