import React, { useState, useEffect, useRef } from "react";
import { Upload, Button, List, message, Progress, Tooltip } from "antd";
import {
  UploadOutlined,
  FileAddOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./documentManager.css";

import {
  fetchDocuments,
  uploadDocument,
  deleteDocument,
} from "@/services/chatbot/aimeService";

const DocumentManager = ({ open, setOpen }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [deleting, setDeleting] = useState(null);
  const [dragging, setDragging] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const docs = await fetchDocuments();
      setDocuments(docs);
    } catch (error) {
      message.error("Lỗi khi tải danh sách tài liệu!");
      console.error("Fetch error:", error);
    }
    setLoading(false);
  };

  const handleUpload = async (file) => {
    const newFile = { name: file.name, progress: 0 };
    setUploadingFiles((prev) => [...prev, newFile]);
    try {
      await uploadDocument(file, (e) => {
        const progress = Math.round((e.loaded / e.total) * 100);
        setUploadingFiles((prev) =>
          prev.map((f) => (f.name === file.name ? { ...f, progress } : f))
        );
      });
      message.success(`Tải lên thành công: ${file.name}`);
      setUploadingFiles((prev) => prev.filter((f) => f.name !== file.name));
      loadDocuments();
    } catch (error) {
      message.error("Lỗi khi tải lên tài liệu!");
      console.error("Upload error:", error);
    }
  };

  const handleDelete = async (docName) => {
    setDeleting(docName);
    try {
      await deleteDocument(docName);
      message.success(`Xoá thành công: ${docName}`);
      setDocuments((prev) => prev.filter((doc) => doc !== docName));
    } catch (error) {
      message.error("Lỗi khi xoá tài liệu!");
    }
    setDeleting(null);
  };

  useEffect(() => {
    const handleDragOver = (event) => {
      event.preventDefault();
      const hasFile = Array.from(event.dataTransfer.items).some(
        (item) => item.kind === "file"
      );
      if (hasFile) {
        setDragging(true);
      }
    };

    const handleDragLeave = (event) => {
      if (event.relatedTarget === null) {
        setDragging(false);
      }
    };

    const handleDrop = (event) => {
      event.preventDefault();
      setDragging(false);
      if (event.dataTransfer.files.length > 0) {
        Array.from(event.dataTransfer.files).forEach((file) =>
          handleUpload(file)
        );
      }
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={panelRef} className="document-manager">
      {dragging && (
        <div className="drag-overlay">
          <p className="drop-instruction">Drop file in white space! 📂</p>
        </div>
      )}

      <Button
        type="primary"
        icon={<FileAddOutlined />}
        onClick={() => setOpen(!open)}
        className="document-button"
      >
        Documents
      </Button>

      {open && (
        <div className="document-panel">
          <h3>📄 Documents</h3>
          <Upload
            customRequest={({ file }) => handleUpload(file)}
            showUploadList={false}
          >
            <Button type="dashed" icon={<UploadOutlined />} block>
              Add document
            </Button>
          </Upload>

          {uploadingFiles.map((file) => (
            <div key={file.name} className="upload-progress">
              <Tooltip title={file.name}>
                <span className="file-name">{file.name.slice(0, 15)}...</span>
              </Tooltip>
              <Progress percent={file.progress} size="small" />
            </div>
          ))}

          <List
            loading={loading}
            dataSource={documents}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(item)}
                    loading={deleting === item}
                  />,
                ]}
              >
                <Tooltip>
                  <span className="file-name">{item}</span>
                </Tooltip>
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default DocumentManager;
