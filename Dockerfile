# Static site served via nginx on Cloud Run.
# Cloud Run injects $PORT at runtime; nginx must listen on it, so the config
# is templated at container start rather than hardcoded to 8080/80.
FROM nginx:1.27-alpine

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY . /usr/share/nginx/html

# Cloud Run's own health checks hit whatever port we listen on, and this repo
# has its own 404.html already wired up as the error page.
ENV PORT=8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
