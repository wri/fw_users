container_port            = "80"
environment               = "production"
log_level                 = "info"
desired_count             = 2
auto_scaling_min_capacity = 2
auto_scaling_max_capacity = 15

AUTH_URL = "https://api.resourcewatch.org"

healthcheck_path = "/v1/fw_users/healthcheck" // TODO
healthcheck_sns_emails = [] // TODO