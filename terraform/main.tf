provider "aws" {
  region = var.aws_region
}

module "s3" {
  source      = "./modules/s3"
  bucket_name = var.bucket_name
}

module "iam" {
  source      = "./modules/iam"
  bucket_name = module.s3.bucket_name
}

module "lambda" {
  source               = "./modules/lambda"
  lambda_function_name = var.lambda_function_name
  lambda_handler       = var.lambda_handler
  lambda_runtime       = var.lambda_runtime
  lambda_timeout       = var.lambda_timeout
  lambda_role_arn      = module.iam.lambda_role_arn
  env_var_name         = var.env_var_name
  env_var_value        = var.env_var_value
}

module "api_gateway" {
  source               = "./modules/api_gateway"
  api_name             = var.api_name
  lambda_invoke_arn    = module.lambda.lambda_invoke_arn
  lambda_function_name = module.lambda.lambda_function_name
}

resource "null_resource" "lambda_dependencies" {
  triggers = {
    always_run = timestamp()
  }
}

resource "null_resource" "prepare_lambda_package" {
  depends_on = [null_resource.lambda_dependencies]
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command     = file("${path.module}/scripts/prepare_lambda_package.ps1")
    working_dir = path.module
    interpreter = ["PowerShell", "-Command"]
  }
}
