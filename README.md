# Migrating a monolithic application to Kubernetes
The following document describes the migration of a basic Node.js and MongoDB web stack to Kubernetes.

### Prerequisites
This project assumes that you have a Kubernetes Cluster up and running and `kubectl` command line tool installed.

Create a docker image from the NodeJS app.

```shell
$ docker build . -t image-name
```

### Creating a MongoDB Service

The first thing to do is create a PV: 

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mo-data-pv
  labels:
    type: local
spec:
  storageClassName: my-pv
  capacity:
    storage: 500Mi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/var/lib/mongo"
```
then create a PVC: 

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mo-data-pvc
spec:
  storageClassName: my-pv
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 500Mi
```

### Create a node deployment:

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nodejs-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nodejs       
  template:
    metadata:
      labels:
        app: nodejs
    spec:
      containers:
      - name: node
        env:
        - name: MONGO_ENDPOINT
          value: "mongodb://10.32.0.10:27017/users"
        - name: PORT
          value: "8080"
        image: aymanb97/node-app
        ports:
        - containerPort: 8080
---        
apiVersion: v1
kind: Service
metadata:
  name: node-service
spec:
  selector:
    app: nodejs
  ports:
    - port: 8080
      targetPort: 8080
  type: LoadBalancer
```
