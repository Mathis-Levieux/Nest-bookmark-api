# Utilisez une image Node.js en tant qu'image de base
FROM node:20.5.0

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le fichier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installez les dépendances de l'application
RUN npm install

# Copiez le reste des fichiers de l'application
COPY . .

# Exposez le port sur lequel votre application écoute (si nécessaire)
EXPOSE 3001

# Commande à exécuter lorsque le conteneur est démarré
CMD ["npm", "start"]
