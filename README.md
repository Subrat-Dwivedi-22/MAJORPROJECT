# 🚀 CI/CD Pipeline with Kubernetes (EKS) + Autoscaling

## 📌 Overview

This project demonstrates a complete **production-style DevOps workflow**:

- Containerized Node.js application
- CI/CD pipeline using GitHub Actions
- Image storage using AWS ECR
- Deployment on AWS EKS (Kubernetes)
- Rolling updates with zero downtime
- Horizontal Pod Autoscaling (HPA)

---

## 🧱 Architecture

```
Developer → GitHub → GitHub Actions → Docker Build → AWS ECR → AWS EKS → LoadBalancer → Users
```

---

## 🛠️ Tech Stack

- Node.js + Express
- MongoDB
- Docker
- Kubernetes (EKS)
- AWS ECR
- AWS EKS
- GitHub Actions

---

## ⚙️ Key Features

- ✅ Automated CI/CD pipeline
- ✅ Dockerized application
- ✅ Kubernetes deployment with rolling updates
- ✅ Environment variable management via Secrets
- ✅ Liveness & Readiness probes
- ✅ Horizontal Pod Autoscaling (CPU-based)
- ✅ Public access using AWS LoadBalancer

---

## 📁 Project Structure

```
.
├── k8s/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── mongo.yaml
├── .github/workflows/
│   └── pipeline.yml
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── views/
├── public/
├── Dockerfile
├── app.js
├── package.json
├── README.md
```

---

## 🔐 Environment Variables

| Variable Name    | Description                                        |
| ---------------- | -------------------------------------------------- |
| MONGO_URL        | MongoDB connection string used by the application  |
| SESSION_SECRET   | Secret key used to sign session cookies            |
| PORT             | Port on which the application runs (default: 8080) |
| CLOUD_NAME       | Cloudinary cloud name for media storage            |
| CLOUD_API_KEY    | Cloudinary API key                                 |
| CLOUD_API_SECRET | Cloudinary API secret                              |
| ADMIN_NAME       | Default admin username for seeding data            |
| ADMIN_PASSWORD   | Default admin password                             |
| ADMIN_EMAIL      | Default admin email                                |

### Example `.env`

```
MONGO_URL=mongodb://mongo:27017/wanderlust
SESSION_SECRET=your_secret_key
PORT=8080
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
ADMIN_NAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@example.com
```

---

## 🐳 Docker Setup

### Build Image

```
docker build -t my-node-app .
```

---

## ☁️ AWS ECR Setup

### Login

```
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <ECR_URI>
```

### Push Image

```
docker tag my-node-app:latest <ECR_URI>:latest
docker push <ECR_URI>:latest
```

---

## ☸️ Kubernetes Deployment (EKS)

### Apply Configurations

```
kubectl apply -f k8s/
```

### Verify

```
kubectl get pods
kubectl get svc
```

---

## 🔁 CI/CD Pipeline (GitHub Actions)

Pipeline automates:

1. Build Docker image
2. Scan image (Trivy)
3. Push image to AWS ECR
4. Update Kubernetes deployment

### 🔐 GitHub Secrets Configuration

The pipeline uses GitHub Secrets for secure credentials:

| Secret Name    | Purpose                           |
| -------------- | --------------------------------- |
| AWS_ACCESS_KEY | AWS access key for authentication |
| AWS_SECRET_KEY | AWS secret key for authentication |
| ECR_REPO_URI   | URI of the AWS ECR repository     |
| SONAR_TOKEN    | Token for SonarQube analysis      |

👉 Configure these in:

```
GitHub Repo → Settings → Secrets → Actions
```

---

## 🔄 Rolling Updates (Zero Downtime)

Configured using:

```
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 1
    maxSurge: 1
```

👉 Ensures:

- New pods are created before old ones are terminated
- Application remains available during deployment

---

## ⚡ Autoscaling (HPA)

### Create HPA

```
kubectl autoscale deployment node-app --cpu=50% --min=2 --max=3
```

### Behavior

- CPU < 50% → 2 pods
- CPU > 50% → scales up to 3 pods

---

## 🔥 Load Testing

```
kubectl run -i --tty load-generator --rm --image=busybox -- /bin/sh
```

Inside container:

```
while true; do wget -q -O- http://<LOADBALANCER_URL>; done
```

---

## 🌐 Access Application

```
kubectl get svc
```

Open the LoadBalancer URL in browser.

---

## ☁️ Cloudinary Setup

This project uses **Cloudinary** for media storage (images/uploads).

### Required Environment Variables

```
CLOUD_NAME
CLOUD_API_KEY
CLOUD_API_SECRET
```

### Setup Steps

1. Create account at [https://cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy credentials and add to `.env`

---

## 🧠 Key Concepts Demonstrated

- CI/CD automation
- Containerization
- Kubernetes orchestration
- Rolling updates
- Autoscaling
- Infrastructure as Code

---

## 💰 Cost Management

After usage, delete cluster to avoid charges:

```
eksctl delete cluster --name my-cluster --region ap-south-1
```

---

## 🚀 Recreate Project

```
git clone <repo-url>
cd project
kubectl apply -f k8s/
```

---

## 👨‍💻 Author

Subrat Dwivedi

---

## ⭐ Support

If you found this useful, consider giving it a ⭐ on GitHub!
