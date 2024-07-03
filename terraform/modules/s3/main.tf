
resource "aws_s3_bucket" "my_public_bucket" {
  bucket = var.bucket_name
}