[![Board Status](https://dev.azure.com/octodemo-containers/7853e309-eaf4-4a4b-8b3f-f2a41741656e/c285dceb-2a09-4c12-941f-2fadd85b5876/_apis/work/boardbadge/09ce193f-f7a5-476b-9897-8dd793e004be?columnOptions=1)](https://dev.azure.com/octodemo-containers/7853e309-eaf4-4a4b-8b3f-f2a41741656e/_boards/board/t/c285dceb-2a09-4c12-941f-2fadd85b5876/Microsoft.RequirementCategory/)

# GitHub Container Demo Bookstore

A Java based Servlet implementation of a bookstore.

![bookstore](docs/images/bookstore.png)


## Deployment

This application follows a continuous deployment approach whereby any changes made to the default branch `main` will result in a new build and deployment then being made to the target platform.

This is all managed by using GitHub Actions to build, test, scan and deploy to the configured target platform. The project supports multiple target platforms including:

* Azure Web Apps
* Google Cloud Platform Cloud Run
* Any Kubernetes platform (AKS, GKE, EKS, plain old Kubernetes on prem...)

The target platform is currently controlled using the GitHub Actions workflows and enabling/disabling the desired supporting deployment platforms.


## Getting Started
If you are new and wanting to find out more information on the application and how to get started developing on it, take a look in at the [docs](docs/README.md)

