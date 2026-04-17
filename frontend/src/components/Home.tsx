function Home() {
  return (
    <div className="fl-col fl-gap-large vertical-padding-large horizontal-padding">
      <div className="fl-col fl-gap fl-center-cross">
	<img alt="Logo" src="/logo.svg" height="256px" width="256px" />
	<h1>QWShortLink</h1>
	<p>Free and open soure URL shortener built with Django REST Framework and React</p>
      </div>

      <div className="fl-col fl-gap">
	<h2>Convenient Link Management</h2>
	<p>Manage all your links right in your profile</p>
      </div>

      <div className="fl-col fl-gap">
	<h2>Support of Multiple Languages</h2>
	<p>Currently, English and Ukrainian translations are available</p>
      </div>

      <div className="fl-col fl-gap">
	<h2>Responsive Design</h2>
	<p>Access our services from any device you like</p>
      </div>

      <div className="fl-col fl-gap">
	<h2>Completely Free and Open Source</h2>
	<p>QWShortLink is completely free and distributed under the MIT License</p>
      </div>

      <div className="card card-danger fl-col fl-gap">
	<p>Disclaimer</p>

	<p>We distribute our project under the MIT License, which makes everyone able to freely modify the code and host their own instance of QWShortLink. However, we cannot provide any guarantees about the safety of such self-hosted instances.</p>
      </div>
    </div>
  )
}

export default Home
