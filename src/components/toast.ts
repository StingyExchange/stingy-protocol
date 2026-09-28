const TOAST_MS = 3200;

export function showToast(message: string): void {
  let host = document.getElementById("toasts");
  if (!host) {
    host = document.createElement("div");
    host.id = "toasts";
    host.className = "toasts";
    host.setAttribute("role", "status");
    host.setAttribute("aria-live", "polite");
    document.body.appendChild(host);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span class="toast-msg"></span><span class="toast-timer" style="animation-duration:${TOAST_MS}ms"></span>`;
  (toast.querySelector(".toast-msg") as HTMLElement).textContent = message;
  host.appendChild(toast);
  window.setTimeout(() => {
    toast.classList.add("leaving");
    window.setTimeout(() => toast.remove(), 280);
  }, TOAST_MS);
}
