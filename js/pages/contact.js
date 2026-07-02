function renderContactPage() {
    const appContent = document.getElementById('app-content');
    appContent.innerHTML = `
        <div class="container">
            <div class="contact-layout">
                <div>
                    <h1 class="collection-title">Drop us a line</h1>
                    <p style="margin-bottom: var(--spacing-lg);">Feel free to ask any questions about our fabric, order statuses, sizing, or customizations. We will get back to you within 24 hours.</p>
                    <form id="contact-form">
                        <div class="form-group">
                            <label for="contact-name">Name</label>
                            <input type="text" id="contact-name" class="form-control" placeholder="Your full name" required>
                        </div>
                        <div class="form-group">
                            <label for="contact-email">Email Address</label>
                            <input type="email" id="contact-email" class="form-control" placeholder="Your email address" required>
                        </div>
                        <div class="form-group">
                            <label for="contact-phone">Phone Number</label>
                            <input type="tel" id="contact-phone" class="form-control" placeholder="Your active phone number">
                        </div>
                        <div class="form-group">
                            <label for="contact-msg">Message</label>
                            <textarea id="contact-msg" class="form-control" rows="6" placeholder="Write your message here..." required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">Send Message</button>
                    </form>
                </div>

                <div>
                    <div class="contact-info-card">
                        <h3>Contact Information</h3>
                        <ul class="contact-info-list">
                            <li>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-accent);"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                <div>
                                    <strong>Shop Address</strong>
                                    <p>shop# 57 kacha jail road chunghi ammar sindhu lahore, Pakistan</p>
                                </div>
                            </li>
                            <li>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-accent);"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                <div>
                                    <strong>Support Email</strong>
                                    <p><a href="mailto:silaikarhai@outlook.com">silaikarhai@outlook.com</a></p>
                                </div>
                            </li>
                            <li>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-accent);"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                <div>
                                    <strong>Phone / WhatsApp</strong>
                                    <p><a href="tel:+923047753773">+92 304 7753773</a></p>
                                </div>
                            </li>
                            <li>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-accent);"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                <div>
                                    <strong>Working Hours</strong>
                                    <p>Everyday: 11:00 am - 8:00 pm</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert("Thank you for contacting Silai Karhai! We have received your message and will reach out shortly.");
        this.reset();
    });
}
