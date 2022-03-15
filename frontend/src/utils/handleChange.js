export default function(e, value, setValue) {
    setValue({
        ...value,
        [e.target.name]: e.target.value
    })
}