export const theme = (() => {
    const themeToggle = document.querySelector("#toggler")
    themeToggle.addEventListener("click", () => {
        const test = document.body.dataset.theme
        if (test === ``) {
            document.body.dataset.theme = "dark"
            themeToggle.innerHTML = `<span class="mdi mdi-white-balance-sunny"></span>`
        } else {
            document.body.dataset.theme = ""
            themeToggle.innerHTML = `<span class="mdi mdi-weather-night"></span>`
        }
    })
})