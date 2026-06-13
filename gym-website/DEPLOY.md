# Desplegar en Cloudflare Pages

## Pasos para desplegar

### Opción 1: Usando Git (Recomendado)

1. **Subir a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/gym-website.git
   git push -u origin main
   ```

2. **Conectar con Cloudflare Pages**
   - Ve a [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Ve a Pages → Crear un proyecto
   - Selecciona "Conectar a Git"
   - Autoriza GitHub y selecciona tu repositorio
   - En configuración de construcción:
     - Framework: Vite
     - Comando de construcción: `npm run build`
     - Directorio de salida: `dist`
   - Haz clic en "Guardar e implementar"

### Opción 2: Desplegar manualmente

1. **Instalar Wrangler (CLI de Cloudflare)**
   ```bash
   npm install -g wrangler
   ```

2. **Autenticarse con Cloudflare**
   ```bash
   wrangler login
   ```

3. **Construir el proyecto**
   ```bash
   npm run build
   ```

4. **Desplegar**
   ```bash
   wrangler pages deploy dist
   ```

## Personalizar el sitio

Antes de desplegar, actualiza estos valores en los componentes:

### `src/components/Contact.tsx`
- **Número de teléfono**: Reemplaza `+34612345678` con tu número
- **Handle de Instagram**: Reemplaza `'elitegym'` con tu usuario de Instagram

### `src/components/Hero.tsx`
- **Título**: Reemplaza "Elite Gym" con el nombre de tu gym
- **Descripción**: Actualiza el texto descriptivo
- **Imagen**: Reemplaza la URL de la imagen de fondo con una propia

### `src/components/Schedule.tsx`
- Actualiza los horarios según tu gym

## Variables de entorno (opcional)

Si necesitas variables de entorno, crea un archivo `.env.local`:
```env
VITE_GYM_NAME=Elite Gym
VITE_PHONE=+34612345678
VITE_INSTAGRAM=elitegym
```

Y actualiza los componentes para usar `import.meta.env.VITE_*`

## Comandos útiles

```bash
# Desarrollo local
npm run dev

# Compilar para producción
npm run build

# Previsualizar la compilación
npm run preview

# Type checking
npm run type-check
```

## Soporte técnico

Si tienes problemas con Cloudflare Pages:
- [Documentación de Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Documentación de Wrangler](https://developers.cloudflare.com/workers/wrangler/)
