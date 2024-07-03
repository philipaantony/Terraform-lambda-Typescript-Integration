variable "aws_region" {
  description = "The AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
  default     = "s3-bucket-created-by-terraform1"
}

variable "lambda_function_name" {
  description = "Name of the Lambda function"
  type        = string
  default     = "todo_lambda_function"
}

variable "lambda_handler" {
  description = "Handler for the Lambda function"
  type        = string
  default     = "dist/controller/todocontroller.handler"
}

variable "lambda_runtime" {
  description = "Runtime for the Lambda function"
  type        = string
  default     = "nodejs20.x"
}

variable "lambda_timeout" {
  description = "Timeout for the Lambda function in seconds"
  type        = number
  default     = 30
}

variable "env_var_name" {
  description = "Name of the environment variable for Lambda"
  type        = string
  default     = "ENV_VAR_NAME"
}

variable "env_var_value" {
  description = "Value of the environment variable for Lambda"
  type        = string
  default     = "value"
}

variable "api_name" {
  description = "Name of the API Gateway"
  type        = string
  default     = "LambdaAPI"
}
