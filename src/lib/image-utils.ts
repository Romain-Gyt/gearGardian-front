export async function validateImageFile(file: File, options = { maxSizeMB: 2, maxWidth: 2000, maxHeight: 2000 }): Promise<boolean> {
    const { maxSizeMB, maxWidth, maxHeight } = options;

    // Vérifie la taille du fichier
    const sizeMB = file.size / 1024 / 1024;
    if (sizeMB > maxSizeMB) return false;

    // Vérifie les dimensions de l’image
    const image = await loadImage(file);
    if (image.width > maxWidth || image.height > maxHeight) return false;

    return true;
}

function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = reject;
        img.src = url;
    });
}

export async function compressImage(file: File, maxWidth = 1024, maxHeight = 1024, quality = 0.8): Promise<File> {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    return new Promise((resolve, reject) => {
        img.onload = () => {
            const canvas = document.createElement('canvas');

            let { width, height } = img;
            const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
            width *= ratio;
            height *= ratio;

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('Canvas not supported'));

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                if (!blob) return reject(new Error('Compression échouée'));
                const compressedFile = new File([blob], file.name, { type: file.type });
                resolve(compressedFile);
                URL.revokeObjectURL(objectUrl);
            }, file.type, quality);
        };

        img.onerror = () => {
            reject(new Error('Erreur lors du chargement de l’image'));
            URL.revokeObjectURL(objectUrl);
        };

        img.src = objectUrl;
    });
}
