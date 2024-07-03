
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../../package"
  output_path = "${path.module}/../../../lambda.zip"
}

resource "aws_lambda_function" "todo_lambda" {
  function_name = var.lambda_function_name
  handler       = var.lambda_handler
  runtime       = var.lambda_runtime
  role          = var.lambda_role_arn
  timeout       = var.lambda_timeout
  filename      = data.archive_file.lambda_zip.output_path

  environment {
    variables = {
      ENV_VAR_NAME = var.env_var_value
    }
  }
}
