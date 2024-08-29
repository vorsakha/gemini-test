class File {
  id: string;

  mime_type: string;

  image_url: string;

  constructor(id: string, mime_type: string, image_url: string) {
    this.id = id;
    this.mime_type = mime_type;
    this.image_url = image_url;
  }
}

export default File;
