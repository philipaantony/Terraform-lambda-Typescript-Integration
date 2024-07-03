output "api_gateway_invoke_url" {
  description = "The invoke URL for the API Gateway"
  value       = module.api_gateway.invoke_url
}

output "lambda_function_arn" {
  description = "The ARN of the Lambda function"
  value       = module.lambda.lambda_function_arn
}

output "s3_bucket_name" {
  description = "The name of the created S3 bucket"
  value       = module.s3.bucket_name
}
