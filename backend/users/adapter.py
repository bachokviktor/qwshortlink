from allauth.account.adapter import DefaultAccountAdapter

from .tasks import send_async_email


class CustomAccountAdapter(DefaultAccountAdapter):
    def send_mail(self, template_prefix, email, context):
        context.update({
            "current_site": {
                "domain": "https://qwsl.click",
                "name": "QWShortLink",
            },
        })

        msg = self.render_mail(template_prefix, email, context)

        send_async_email.delay(
            subject=msg.subject,
            message=msg.body,
            sender=msg.from_email,
            recipient=msg.to
        )
