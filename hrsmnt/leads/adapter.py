from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings


class AccountAdapter(DefaultAccountAdapter):
    def send_mail(self, template_prefix, email, context):
        context['activate_url'] = settings.HOST + '#/verify-email/' + context['key']
        msg = self.render_mail(template_prefix, email, context)
        msg.send()
