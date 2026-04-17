interface PropsInterface {
  deleteLinkId: number | null;
  setDeleteLinkId: (value: number | null) => void;
  setIsDeletingLink: (value: boolean) => void;
  deleteLink: (id: number | null) => void;
}

function LinkDelete({deleteLinkId, setDeleteLinkId, setIsDeletingLink, deleteLink}:PropsInterface) {
  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <div className="card fl-col fl-gap">
	<h2>Delete the link?</h2>
	<p>This action cannot be reverted.</p>

	<div className="fl-gap fl-wrap">
	  <button className="btn btn-danger fl-grow" onClick={() => deleteLink(deleteLinkId)}>Delete</button>
	  <button className="btn btn-neutral fl-grow" onClick={() => {setDeleteLinkId(null); setIsDeletingLink(false)}}>Cancel</button>
	</div>
      </div>
    </div>
  )
}

export default LinkDelete
