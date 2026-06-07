import Markdown from "react-markdown"
import terms from "../docs/terms-of-service.md?raw"

function TermsOfService() {
  return (
    <div className="fl-col fl-gap-large vertical-padding-large horizontal-padding">
      <div className="fl-col fl-gap narrow-width">
        <Markdown>{terms}</Markdown>
      </div>
    </div>
  )
}

export default TermsOfService
