#!/bin/bash

# This script is intended to be used as a post-deploy hook when certbot renews the SSL certificate in order for the change to take effect.
# It should be placed in the /etc/letsencrypt/renewal-hooks/deploy/ directory and made executable.

pm2 restart a-shift-calendar --update-env
pm2 save