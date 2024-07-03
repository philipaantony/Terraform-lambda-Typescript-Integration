output "api_id" {
  description = "The ID of the API Gateway"
  value       = aws_api_gateway_rest_api.lambda_api.id
}

output "invoke_url" {
  description = "The invoke URL for the API Gateway"
  value       = "${aws_api_gateway_deployment.lambda_deployment.invoke_url}${aws_api_gateway_resource.lambda_resource.path}"
}