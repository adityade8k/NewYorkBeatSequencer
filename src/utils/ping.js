export function ping(label = "Alias test"){
    const message = `utils/ping: ${label} ✅`;
    console.log(message);
    return (message);
}