container_port            = "80"
environment               = "staging"
log_level                 = "info"
desired_count             = 1
auto_scaling_min_capacity = 1
auto_scaling_max_capacity = 15

AUTH_URL = "https://staging-api.resourcewatch.org"

healthcheck_path = "/v1/fw_users/healthcheck" // TODO
healthcheck_sns_emails = [] // TODO