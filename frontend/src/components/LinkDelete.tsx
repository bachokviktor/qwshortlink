import { useTranslation } from "react-i18next"
import "../i18n"

interface PropsInterface {
  deleteLinkId: number | null;
  setDeleteLinkId: (value: number | null) => void;
  setIsDeletingLink: (value: boolean) => void;
  deleteLink: (id: number | null) => void;
}

function LinkDelete({deleteLinkId, setDeleteLinkId, setIsDeletingLink, deleteLink}:PropsInterface) {
  const {t} = useTranslation()

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <title>{`${t("linkDeletePage.title")} - QWShortLink`}</title>

      <div className="card fl-col fl-gap">
        <h2>{t("linkDeletePage.title")}</h2>
        <p>{t("linkDeletePage.body")}</p>

        <div className="fl-gap fl-wrap">
          <button className="btn btn-danger fl-grow" onClick={() => deleteLink(deleteLinkId)}>{t("actions.delete")}</button>
          <button className="btn btn-neutral fl-grow" onClick={() => {setDeleteLinkId(null); setIsDeletingLink(false)}}>{t("actions.cancel")}</button>
        </div>
      </div>
    </div>
  )
}

export default LinkDelete
