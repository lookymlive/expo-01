# Proyecto Expo-01 🚀

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Configuración Paso a Paso 🔧✨

Sigue estos pasos para configurar el proyecto correctamente:

1. **Instalación de Dependencias**

   - 📥 Ejecuta `npm install` o `yarn install` para instalar todas las dependencias.

2. **Configuración del Archivo .env**

   - 📝 Crea o edita el archivo `.env` en la raíz del proyecto.
   - 🔑 Agrega tus claves de Supabase y Google:

     ```
     EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-client-id.apps.googleusercontent.com
     EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
     EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com

     # Supabase Configuration
     EXPO_PUBLIC_SUPABASE_URL=https://rgqsdnqdoqktcsajgfhx.supabase.co
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

     # Cloudinary Configuration
     EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
     EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
     ```

3. **Inicialización de Supabase**

   - 🔐 El cliente Supabase se configura en `lib/supabase.ts` usando las claves definidas.
   - 📌 Revisa que el archivo importe `AsyncStorage` y use la URL y clave de Supabase correctamente.

4. **Ejecuta el Proyecto**

   - 🚀 Utiliza `expo start -c` para limpiar la caché y arrancar el proyecto.

5. **Verifica la Configuración**
   - 👀 Revisa la consola para asegurarte de que no aparezcan errores relacionados con las variables de entorno.

¡Y listo! Ahora tienes una configuración completa para tu proyecto con Expo y Supabase. 🎉

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
