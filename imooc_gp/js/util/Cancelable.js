export default function makeCancelable(promise) {

    let hasCancel = false;
    let wrapPromise = new Promise((resolve, reject) => {
        promise.then((val) => {
            hasCancel ? reject({isCanceled: true}) : resolve(val)
        });
        promise.catch((error) => {
            hasCancel ? reject({isCanceled: true}) : resolve(error)
        });
    })
    return {
        promise: wrapPromise,
        cancel() {
            hasCancel = true;
        }
    }

}