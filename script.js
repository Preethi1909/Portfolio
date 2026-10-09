const EMAIL = "preethi.u192257@gmail.com";
const root = document.documentElement;

/* ---------- Contact form ---------- */
const form = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

form.addEventListener("submit", function(event){
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    if(name === "" || email === "" || message === ""){
        formMessage.textContent = "Required field cannot be empty";
        return;
    }
    // No backend: open a prefilled Gmail compose tab so the visitor can send it.
    const subject = encodeURIComponent("Portfolio message from " + name);
    const body = encodeURIComponent(message + "\n\nFrom: " + name + " (" + email + ")");
    const url = "https://mail.google.com/mail/?view=cm&fs=1&to=" + EMAIL + "&su=" + subject + "&body=" + body;
    window.open(url, "_blank", "noopener");
    formMessage.textContent = "Gmail opened in a new tab. Press Send there to deliver your message.";
    form.reset();
});

/* ---------- Dark mode toggle ---------- */
document.getElementById("themeToggle").addEventListener("click", function(){
    const dark = root.getAttribute("data-theme") !== "dark";
    if(dark){
        root.setAttribute("data-theme", "dark");
        root.setAttribute("data-bs-theme", "dark");
    }
    else{
        root.removeAttribute("data-theme");
        root.setAttribute("data-bs-theme", "light");
    }
    try{ localStorage.setItem("theme", dark ? "dark" : "light"); }catch(e){}
});

/* ---------- Mobile menu: close after tapping a link ---------- */
const navMenu = document.getElementById("navMenu");
const navLinks = navMenu.querySelectorAll("a");
navLinks.forEach(function(link){
    link.addEventListener("click", function(){
        if(navMenu.classList.contains("show")){
            bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
        }
    });
});

/* ---------- Scroll reveal ---------- */
const revealItems = document.querySelectorAll(".reveal");
function finishReveal(el){
    // Drop the helper classes so hover transitions go back to normal.
    setTimeout(function(){
        el.classList.remove("reveal", "visible");
        el.style.transitionDelay = "";
    }, 1500);
}
if("IntersectionObserver" in window){
    const observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
            if(!entry.isIntersecting) return;
            const el = entry.target;
            const siblings = Array.prototype.filter.call(el.parentElement.children, function(c){
                return c.classList.contains("reveal");
            });
            el.style.transitionDelay = (siblings.indexOf(el) * 0.1) + "s";
            el.classList.add("visible");
            observer.unobserve(el);
            finishReveal(el);
        });
    }, { threshold: 0.12 });
    revealItems.forEach(function(el){ observer.observe(el); });
}
else{
    revealItems.forEach(function(el){ el.classList.add("visible"); });
}

/* ---------- Active nav link + back-to-top ---------- */
const sections = Array.prototype.map.call(navLinks, function(link){
    return document.querySelector(link.getAttribute("href"));
});
const backToTop = document.getElementById("backToTop");
let ticking = false;

function onScroll(){
    const y = window.scrollY;
    let current = 0;
    sections.forEach(function(section, i){
        if(section && section.offsetTop - 120 <= y) current = i;
    });
    // Bottom of the page: the short last section should still win.
    if(window.innerHeight + y >= document.documentElement.scrollHeight - 4){
        current = sections.length - 1;
    }
    navLinks.forEach(function(link, i){
        link.classList.toggle("active", i === current);
    });
    backToTop.classList.toggle("show", y > 500);
    ticking = false;
}
window.addEventListener("scroll", function(){
    if(!ticking){
        ticking = true;
        window.requestAnimationFrame(onScroll);
    }
}, { passive: true });
onScroll();

backToTop.addEventListener("click", function(){
    window.scrollTo({ top: 0, behavior: "smooth" });
});
