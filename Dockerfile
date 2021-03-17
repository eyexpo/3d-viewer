FROM zaixiaoqu/nginx-php:v6.1.74

EXPOSE 80

# sudo docker run --privileged=true --restart=always -d -e webRootName=demo -v /Users/ailor/PhpstormProjects/3d-viewer/src:/var/www/html -p 8098:80  --name 3d-viewer zaixiaoqu/nginx-php:v6.1.74
