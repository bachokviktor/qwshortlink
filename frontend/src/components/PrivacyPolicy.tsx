import Markdown from "react-markdown"
import policy from "../docs/privacy-policy.md?raw"

function PrivacyPolicy() {
  return (
    <div className="fl-col fl-gap-large vertical-padding-large horizontal-padding">
      <div className="fl-col fl-gap narrow-width">
        <Markdown>{policy}</Markdown>
      </div>
    </div>
  )
}

export default PrivacyPolicy
