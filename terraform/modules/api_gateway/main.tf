resource "aws_api_gateway_rest_api" "lambda_api" {
  name        = var.api_name
  description = "API Gateway for Lambda function"
}

resource "aws_api_gateway_resource" "lambda_resource" {
  parent_id   = aws_api_gateway_rest_api.lambda_api.root_resource_id
  path_part   = "todo"
  rest_api_id = aws_api_gateway_rest_api.lambda_api.id
}

resource "aws_api_gateway_resource" "lambda_resource_id" {
  parent_id   = aws_api_gateway_resource.lambda_resource.id
  path_part   = "{id}"
  rest_api_id = aws_api_gateway_rest_api.lambda_api.id
}

# GET Method
resource "aws_api_gateway_method" "lambda_method_get" {
  rest_api_id   = aws_api_gateway_rest_api.lambda_api.id
  resource_id   = aws_api_gateway_resource.lambda_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

# POST Method
resource "aws_api_gateway_method" "lambda_method_post" {
  rest_api_id   = aws_api_gateway_rest_api.lambda_api.id
  resource_id   = aws_api_gateway_resource.lambda_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

# DELETE Method
resource "aws_api_gateway_method" "lambda_method_delete" {
  rest_api_id   = aws_api_gateway_rest_api.lambda_api.id
  resource_id   = aws_api_gateway_resource.lambda_resource_id.id
  http_method   = "DELETE"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.id" = true
  }
}

# PATCH Method
resource "aws_api_gateway_method" "lambda_method_patch" {
  rest_api_id   = aws_api_gateway_rest_api.lambda_api.id
  resource_id   = aws_api_gateway_resource.lambda_resource_id.id
  http_method   = "PATCH"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.id" = true
  }
}

# API Gateway integration for GET
resource "aws_api_gateway_integration" "lambda_integration_get" {
  rest_api_id             = aws_api_gateway_rest_api.lambda_api.id
  resource_id             = aws_api_gateway_resource.lambda_resource.id
  http_method             = aws_api_gateway_method.lambda_method_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
}

# API Gateway integration for POST
resource "aws_api_gateway_integration" "lambda_integration_post" {
  rest_api_id             = aws_api_gateway_rest_api.lambda_api.id
  resource_id             = aws_api_gateway_resource.lambda_resource.id
  http_method             = aws_api_gateway_method.lambda_method_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
}

# API Gateway integration for DELETE
resource "aws_api_gateway_integration" "lambda_integration_delete" {
  rest_api_id             = aws_api_gateway_rest_api.lambda_api.id
  resource_id             = aws_api_gateway_resource.lambda_resource_id.id
  http_method             = aws_api_gateway_method.lambda_method_delete.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
}

# API Gateway integration for PATCH
resource "aws_api_gateway_integration" "lambda_integration_patch" {
  rest_api_id             = aws_api_gateway_rest_api.lambda_api.id
  resource_id             = aws_api_gateway_resource.lambda_resource_id.id
  http_method             = aws_api_gateway_method.lambda_method_patch.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
}

# Lambda function permissions for GET, POST, PATCH, DELETE methods
resource "aws_lambda_permission" "api_gateway_invoke_get" {
  statement_id  = "AllowAPIGatewayInvokeGET"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.lambda_api.execution_arn}/*/${aws_api_gateway_method.lambda_method_get.http_method}${aws_api_gateway_resource.lambda_resource.path}"
}

resource "aws_lambda_permission" "api_gateway_invoke_post" {
  statement_id  = "AllowAPIGatewayInvokePOST"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.lambda_api.execution_arn}/*/${aws_api_gateway_method.lambda_method_post.http_method}${aws_api_gateway_resource.lambda_resource.path}"
}

resource "aws_lambda_permission" "api_gateway_invoke_patch" {
  statement_id  = "AllowAPIGatewayInvokePATCH"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.lambda_api.execution_arn}/*/${aws_api_gateway_method.lambda_method_patch.http_method}${aws_api_gateway_resource.lambda_resource.path}/{id}"
}

resource "aws_lambda_permission" "api_gateway_invoke_delete" {
  statement_id  = "AllowAPIGatewayInvokeDELETE"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.lambda_api.execution_arn}/*/${aws_api_gateway_method.lambda_method_delete.http_method}${aws_api_gateway_resource.lambda_resource.path}/{id}"
}

resource "aws_api_gateway_deployment" "lambda_deployment" {
  depends_on = [
    aws_api_gateway_integration.lambda_integration_get,
    aws_api_gateway_integration.lambda_integration_post,
    aws_api_gateway_integration.lambda_integration_patch,
    aws_api_gateway_integration.lambda_integration_delete
  ]

  rest_api_id = aws_api_gateway_rest_api.lambda_api.id
  stage_name  = "dev"
}
