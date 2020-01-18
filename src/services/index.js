import EmailService from './email-service'
import SmsService from './sms-service'

export default (config, services) => ({
  email: new EmailService(config),
  sms: new SmsService(config),
  ...services
})
