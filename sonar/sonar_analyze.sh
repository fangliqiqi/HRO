#!/bin/bash

sonar-scanner \
  -Dsonar.projectKey=hrms \
  -Dsonar.sources=./src/views \
  -Dsonar.host.url=http://36.7.147.2:9000 \
  -Dsonar.login=liangmx \
  -Dsonar.password=nana5.bao

if [ $? -eq 0 ]; then
    echo "sonarqube code-analyze over."
fi