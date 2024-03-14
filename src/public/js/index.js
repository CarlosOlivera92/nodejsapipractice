const showToast = (message, error) => {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    if (error) {
        toast.classList.add('toastError');
    } else {
        toast.classList.add('toastSuccess');
    }
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500);
        }, 2500);
    }, 100);
};
const showLoadingSpinner = () => {
    const loadingContainer = document.createElement('div');
    loadingContainer.id = 'loading-container';
    loadingContainer.classList.add('loading-container');

    const loadingSpinner = document.createElement('div');
    loadingSpinner.classList.add('loading-spinner');

    loadingContainer.appendChild(loadingSpinner);
    document.body.appendChild(loadingContainer);

    return loadingContainer;
};
const hideLoadingSpinner = () => {
    const loadingContainer = document.getElementById('loading-container');
    if (loadingContainer) {
        loadingContainer.remove();
    }
};