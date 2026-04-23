# 🚀 CI/CD Pipeline with Kubernetes (EKS) + Autoscaling

## 📌 Overview

This project demonstrates a complete production-style workflow:

- Dockerized Node.js application
- CI/CD pipeline using GitHub Actions
- Image storage using AWS ECR
- Deployment on AWS EKS (Kubernetes)
- Horizontal Pod Autoscaling (HPA)

---

## 🧱 Architecture

```
GitHub → GitHub Actions → Docker Build → ECR → EKS → LoadBalancer → Users
```

---

## 🛠️ Tech Stack

- Node.js + Express
- MongoDB
- Docker
- Kubernetes (Minikube + EKS)
- AWS ECR
- AWS EKS
- GitHub Actions

---

## ⚙️ Features

- ✅ CI/CD pipeline (auto build & deploy)
- ✅ Containerized application
- ✅ Kubernetes deployment
- ✅ Environment variable management using Secrets
- ✅ Health checks (liveness & readiness probes)
- ✅ Horizontal Pod Autoscaling
- ✅ Public access via LoadBalancer

---

## 📁 Project Structure

```
.
├── k8s/
│   ├── deployment.yaml
│   ├── service.yaml
├── .github/workflows/
│   └── pipeline.yml
├── Dockerfile
├── app.js
├── package.json
└── .env
```

---

## 🚀 Step-by-Step Setup

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

---

### 2️⃣ Create Kubernetes Secret

```bash
kubectl create secret generic app-secret --from-env-file=.env
```

---

### 3️⃣ Build & Push Docker Image (Manual)

```bash
docker build -t my-node-app .
docker tag my-node-app:latest <ECR_URI>:latest
docker push <ECR_URI>:latest
```

---

### 4️⃣ Deploy to Kubernetes (EKS)

```bash
kubectl apply -f k8s/
```

Check:

```bash
kubectl get pods
kubectl get svc
```

---

### 5️⃣ Access Application

Get LoadBalancer URL:

```bash
kubectl get svc
```

Open in browser.

---

## 🔁 CI/CD Pipeline (GitHub Actions)

Pipeline automatically:

1. Builds Docker image
2. Pushes to AWS ECR
3. Updates Kubernetes deployment

### Workflow includes:

```yaml
- Build Docker Image
- Push to ECR
- Update EKS Deployment
```

---

## ⚡ Autoscaling Setup

### Create HPA

```bash
kubectl autoscale deployment node-app --cpu=50% --min=1 --max=3
```

### Verify

```bash
kubectl get hpa
```

---

## 🔥 Load Testing (to trigger scaling)

```bash
kubectl run -i --tty load-generator --rm --image=busybox -- /bin/sh
```

Inside container:

```sh
while true; do wget -q -O- http://<LOADBALANCER_URL>; done
```

Watch scaling:

```bash
kubectl get pods -w
```

---

## 🧠 Key Concepts

- HPA scales based on **CPU utilization**, not traffic directly
- Kubernetes requires **resource requests** for autoscaling
- Readiness probes ensure traffic is only sent to healthy pods

---

## 💰 Cost Consideration

- EKS cluster incurs cost (~$0.10/hour)
- EC2 node cost (~$0.02/hour)
- LoadBalancer cost (~$0.02/hour)

👉 Delete cluster after use:

```bash
eksctl delete cluster --name my-cluster --region ap-south-1
```

---

## 🎯 Demo Flow

1. Show running app (LoadBalancer URL)
2. Show pods:

   ```bash
   kubectl get pods
   ```

3. Show autoscaler:

   ```bash
   kubectl get hpa
   ```

4. Generate load
5. Show scaling (pods increasing)

---

## 📌 Future Improvements

- Use Helm charts
- Add Ingress + domain
- Implement Cluster Autoscaler
- Add monitoring (Prometheus + Grafana)

---

## 👨‍💻 Author

Your Name

---

## ⭐ If you found this useful

Give it a ⭐ on GitHub!
