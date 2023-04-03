export type DownloadProps = {
    data: any
    fileName: string
    mimeType: string
}
export const downloadFile = ({ data, fileName, mimeType }: DownloadProps) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: mimeType })
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
}
