output "lambda_function_arn" {
  description = "The ARN of the Lambda function"
  value       = aws_lambda_function.todo_lambda.arn
}

output "lambda_function_name" {
  description = "The name of the Lambda function"
  value       = aws_lambda_function.todo_lambda.function_name
}

output "lambda_invoke_arn" {
  description = "The invoke ARN of the Lambda function"
  value       = aws_lambda_function.todo_lambda.invoke_arn
}
