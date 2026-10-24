self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data?.text() || "" }; }
  const title = data.title || "Nueva lectura en El Grimorio";
  const options = {
    body: data.body || "Hay un nuevo artículo en El Nido del Caos.",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    data: { url: data.url || "/grimorio" },
    tag: data.tag || "grimorio-nueva-lectura",
    renotify: false,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/grimorio", self.location.origin).href;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of windows) {
      if (client.url.startsWith(self.location.origin) && "focus" in client) {
        await client.navigate(target);
        return client.focus();
      }
    }
    return self.clients.openWindow(target);
  })());
});
