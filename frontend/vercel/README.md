# Vercel Deployment Konfiguration

Dieser Ordner enthält die Konfigurationsdateien für das Vercel Deployment.

## Konfigurationsdateien

- `vercel.json`: Hauptkonfigurationsdatei für Vercel
  - Definiert Build-Befehle
  - Konfiguriert Umgebungsvariablen
  - Legt die Region fest (Frankfurt)

## Umgebungsvariablen

Die folgenden Umgebungsvariablen müssen in den Vercel-Projekteinstellungen konfiguriert werden:

- `NEXT_PUBLIC_API_URL`: Die URL der Backend-API

## Deployment

1. Verbinden Sie Ihr GitHub-Repository mit Vercel
2. Konfigurieren Sie die Umgebungsvariablen in den Vercel-Projekteinstellungen
3. Deployen Sie das Projekt über die Vercel-Dashboard oder GitHub-Integration 