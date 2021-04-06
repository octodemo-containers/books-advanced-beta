variable "app_name" {
  default = "bookstore-advanced-beta"
}

variable "namespace" {
  default     = "bookstore-advanced-beta-terraform"
  description = "Kubernetes namespace for deployment"
}

variable "container_registry" {
  default     = "ghcr.io"
  description = "The Container Registry to fetch container images from"
}

variable "app_container" {
  type        = string
  description = "The container image name for the application"
  default     = "octodemo-containers/bookstore-advanced-beta"
}

variable "app_container_version" {
  type = string
}

variable "database_container" {
  type        = string
  description = "The comtainer image name for the database"
  default     = "octodemo-containers/bookstore-advanced-beta-database"
}

variable "database_container_version" {
  type = string
}

variable "ENVIRONMENT" {
  type        = string
  description = "The environment being deployed to"
  default     = "dev"
}