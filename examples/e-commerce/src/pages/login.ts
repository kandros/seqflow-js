import { ComponentParam } from "seqflow-js"
import { UserType, userDomain } from "../domains/user/UserDomain"
import { UserLoggedEvent } from "../domains/user/events"


export async function Login({ dom, event }: ComponentParam) {
  dom.render(`<div>
  <form>
    <label for="username">Username</label>
    <input type="text" name="username" value="johnd" />
    <p class="error"></p>
    <button type="submit">Login</button>
  </form>
</div>`)

  const el = dom.querySelector<HTMLInputElement>('input[name="username"]')
  const p = dom.querySelector('.error')
  const button = dom.querySelector<HTMLButtonElement>('button')

  const events = event.waitEvent(event.domEvent('submit'))
  let user: UserType | undefined
  for await (const _ of events) {
    button.disabled = true
    const username = el.value

    user = await userDomain.login({ username })
    if (!user) {
      p.textContent = 'User not found. Try "johnd"'
      button.disabled = false
      continue
    }
    break
  }

  console.log('QUIQUIQUI')
  event.dispatchDomainEvent(new UserLoggedEvent(user!))
  console.log('QUAQUAQUA')
  event.navigate('/')
}